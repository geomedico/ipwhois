# Backend Position Technical Task

Implement REST API that allows users to:
- Lookup for a particular IP address info via https://ipwhois.io/ and store in to DB
- Response with a stored lookup info from DB in case the spefic IP was already searched (DB-caching)
- Remove cached result by IP
- Cache should be auto-removed after TTL of 60 seconds, so only the cache result would be updated each 60 seconds for the particular IP address 

## Required parts
- SQL or noSQL database or file
- Typescript
- Clean Architecture

## Up to candidate
- Tests
- Deployment infrastructure preparation (Docker, Serverless, etc.)

# ipwhois