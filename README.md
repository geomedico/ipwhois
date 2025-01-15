# **Backend Position Technical Task**

Implement REST API that allows users to:

- Lookup for a particular IP address info via [https://ipwhois.io/](https://ipwhois.io/) and store it into DB.
- Respond with a stored lookup info from DB in case the specific IP was already searched (DB-caching).
- Remove cached result by IP.
- Cache should be auto-removed after TTL of 60 seconds, so only the cache result would be updated each 60 seconds for the particular IP address.

## **Required parts**

- SQL or noSQL database or file
- Typescript
- Clean Architecture

## **Up to candidate**

- Tests
- Deployment infrastructure preparation (Docker, Serverless, etc.)

---

## **Requirements**

- **Node.js** version **20** or higher.
- **pnpm** package manager installed globally.

## **Project Features**

- Implements clean architecture principles.
- Uses a caching mechanism to prevent redundant external API calls.
- Automatically refreshes cached data every 60 seconds for active IP addresses using **Bull** queues.
- Provides APIs for fetching and removing IP data from cache and database.

## **Architecture Overview**

- **Fastify**: For handling REST API routes.
- **MongoDB**: For persistent storage of IP lookup results.
- **Redis**: For caching and Bull queue management.
- **Bull**: For background job scheduling to refresh cache.
- **Docker**: To containerize the entire application stack.

## **Project launch**

- **bash command**: `docker-compose up --build`

## **API References**

The project provides two HTTP API endpoints for interacting with the system.

### **1. Lookup data by IP**

- **Endpoint**: `POST /lookup/:ip`
- **Description**: Fetches and stores IP address data. If cached or stored in the database, the data will be returned without external fetching.
- **Example Request**:
  ```bash
  curl -X POST http://localhost:3000/lookup/193.254.165.0 -H "Content-Type: application/json" -d '{}'
  ```

### **2. Delete lookup data by ip**

- **Endpoint**: `DELETE /lookup/:ip`
- **Description**: Deletes cached data and removes the Bull queue job for the specified IP address.
- **Example Request**:
  ```bash
  curl -X DELETE http://localhost:3000/lookup/193.254.165.0  -H "Content-Type: application/json" -d '{}'
  ```
