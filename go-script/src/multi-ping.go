package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/go-ping/ping"
)

const (
	numWorkers = 100
)

type pingResult struct {
	IP     string
	Status bool
}


func pingHost(ip string, ch chan<- pingResult) {
	pinger, err := ping.NewPinger(ip)
	if err != nil {
		log.Printf("Error al crear el pinger para %s: %v", ip, err)
		ch <- pingResult{IP: ip, Status: false}
		return
	}

	pinger.Count = 1
	pinger.Timeout = time.Second * 2
	pinger.SetPrivileged(true)

	err = pinger.Run()
	if err != nil {
		log.Printf("Error al realizar el ping a %s: %v", ip, err)
		ch <- pingResult{IP: ip, Status: false}
		return
	}

	stats := pinger.Statistics()
	ch <- pingResult{IP: ip, Status: stats.PacketsRecv > 0}
}

func worker(id int, jobs <-chan string, results chan<- pingResult) {
	for ip := range jobs {
		fmt.Printf("Worker %d haciendo ping a %s\n", id, ip)
		pingHost(ip, results)
	}
}

func main() {
	data, err := os.ReadFile("./utils/ips.txt")
	if err != nil {
		log.Fatalf("No se pudo leer el archivo de IPs: %v", err)
	}

	lines := strings.Split(string(data), "\n")

	var ips []string
	for _, line := range lines {
		if line != "" {
			ips = append(ips, line)
		}
	}

	jobs := make(chan string, len(ips))
	results := make(chan pingResult, len(ips))

	for w := 1; w <= numWorkers; w++ {
		go worker(w, jobs, results)
	}

	for _, ip := range ips {
		jobs <- ip
	}
	close(jobs)

	for i := 0; i < len(ips); i++ {
		result := <-results
		if result.Status {
			fmt.Printf("Ping exitoso a %s\n", result.IP)
		} else {
			fmt.Printf("No se pudo hacer ping a %s\n", result.IP)
		}
	}

	close(results)
}
