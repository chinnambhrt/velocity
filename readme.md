# Velocity SMTP Server

Velocity is a simple and configurable email server supporting ESMTP, STARTTLS, and other SMTP extensions.

## Features

- **ESMTP Support**: Extended SMTP commands.
- **STARTTLS**: Secure your connections with TLS.
- **Chunking**: Send large messages in smaller parts.
- **Enhanced Status Codes**: Detailed status information.
- **8BITMIME**: Support for 8-bit characters.
- **SMTPUTF8**: Support for internationalized email addresses.
- **DSN**: Delivery Status Notifications.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/chinnambhrt/velocity.git
    cd velocity
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a  file in the root directory with the following content:

    ```env

    V_PORT=4300
    V_LOG_LEVEL=debug

    ```

## Usage

### Start the Server

To start the server, run:

```sh

npm start

```

For development mode with auto-reloading, run:

```sh
npm run dev
```

### Configuration

Configuration options are available in the `config.js` file. You can customize the server settings, such as ports, log levels, and server capabilities.

### Logging

Logs can be written to a file or the console. Configure the log settings in the `config.js` file.

## Project Structure

```plaintext

.env
.gitignore
certs/
    pass.txt
    server-cert.pem
    server-csr.pem
    server-key.pem
package.json
readme.md
src/
    config/
        config.js
    index.js
    lib/
        client.js
        parser.js
        server.js
        state.js
    logger.js
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
