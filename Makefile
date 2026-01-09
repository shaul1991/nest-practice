.PHONY: help app-up app-down env-copy clean logs

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

env-copy: ## Copy .env.example to .env
	@if [ -f .env.example ]; then \
		cp .env.example .env; \
		echo "✓ .env file created from .env.example"; \
	else \
		echo "✗ .env.example not found"; \
		exit 1; \
	fi

app-up: ## Start docker containers
	@echo "Starting containers..."
	docker-compose up -d
	@echo "✓ Containers started"
	@echo "Run 'make logs' to view logs"

app-down: ## Stop docker containers
	@echo "Stopping containers..."
	docker-compose down
	@echo "✓ Containers stopped"

logs: ## Show container logs (use 'make logs -f' for follow mode)
	docker-compose logs -f

clean: ## Stop containers and remove volumes
	@echo "Stopping containers and removing volumes..."
	docker-compose down -v
	@echo "✓ Containers and volumes removed"

restart: app-down app-up ## Restart containers
