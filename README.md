## akenza-examples

A set of examples for using the `akenza` API. 

Also refer to the [product documentation](https://docs.akenza.io/) and the documentation of the [REST API](https://docs.api.akenza.io/).

## Examples

```
examples/
├── data
│   ├── data-stream-with-tag.mjs        Subscribe to the akenza data stream API with a tag.
│   ├── data-stream.mjs                 Subscribe to the akenza data stream API for a device/set of devices.
│   └── query-data.mjs                  Query historical data for a device.
├── management
│   ├── get-device.mjs                  Retrieve a device by akenza id and device id.
│   ├── get-devices.mjs                 Retrieve a set of devices.
│   └── get-tags.mjs                    Retrieve a set of tags.
├── uplink
│   ├── http-send-data.mjs              Send an HTTP uplink.
│   ├── mqtt-send-data-tls.mjs          Send an MQTT uplink using TLS.
│   └── mqtt-send-data.mjs              Send an MQTT uplink.
```

## Before you start

- [Create an api key](https://docs.akenza.io/api-reference/api-documentation#api-keys) for your organization
- Retrieve the id of the workspace you want to use
- Retrieve the akenza device id and device id of an existing device in the platform from that workspace (required for getting a device and querying data)
- Create a `.env` file

```
cp .env.template .env
```

- Fill in the information
- (optional) [Create a new HTTP device](https://docs.akenza.io/how-to-connect-a-device) (required for sending data via HTTP)
- (optional) [Create a new MQTT device](https://docs.akenza.io/how-to-connect-a-device) (required for sending data via MQTT)
- Run `npm install`

## Usage

```
node examples/<example.mjs>
```