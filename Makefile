
.PHONY: install backend frontend

install:
	cd backend && npm install
	cd frontend && npm install

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm run serve
