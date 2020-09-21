# Raikiri

Shiden (雷切), meaning "lightning cutter" in Japanese, is a web server that pipes incoming HTTP requests into a message-broker.

# Getting Started
1. Clone repo
```bash
git clone https://github.com/wizo06/Raikiri.git
```
2. Install Node.js dependencies
```bash
npm i
```
3. Make a copy of the template config file
```bash
./prepare.sh
```
4. Edit the config file
```bash
nano conf/user_config.toml
```
5. Start Raikiri
```bash
npm start
```

# Routes
## `/queue`
### GET
  - Description: gets the name, message count, and consumer count of the queue
  - Headers:
    - `Authorization: key_1`

### POST
- Description: sends a JSON payload to the queue
  - Headers:
    - `Authorization: key_1`
    - `Content-Type: application/json`
  - Body:
   ```json
  {
      "field1": "value1",
      "field2": "value2",
  }
  ```