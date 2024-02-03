# Viper Vortex Load Test

This package is designed to perform load testing on the Viper Vortex server. It simulates multiple clients connecting to the server and sending requests.

## Environment Variables

The load test uses the following environment variables:

- `URL`: The URL of the server to test. If not provided, it defaults to `http://localhost:4000`.
- `CLIENT_COUNT`: The number of simulated clients. If not provided, it defaults to 150.

## Running the Load Test

To run the load test, use the following command:

```bash
npm run test
```

Please ensure that the server is running on the URL specified by the URL environment variable before starting the load test. 

## Understanding the Output
The load test outputs the average transactions per second (TPS) for all clients. This value should be close to the TPS defined in the shared package of the Viper Vortex project.
