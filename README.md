<p align="center">
  <a href="https://decent.land">
    <img src="https://mem-home.vercel.app/icons/mem/mem-logo-v2.svg" height="180">
  </a>
  <h3 align="center"><code>@decentldotland/mem-network-viewer</code></h3>
  <p align="center">Molecular Execution Machine (MEM) network inspector</p>
</p>



## Build & Run

```bash
git pull https://github.com/decentldotland/mem-network-viewer.git

npm install && npm run start
```

## Endpoints

- `GET /stats` : return network stats
- `GET /contracts` : return MEM contracts & TXs count per contract
- `GET /contract/txs/:id` : return contract's transaction (`id` : contract id)
- `GET /txs/:limit/:type` : return network's transactions for a given count `limit` and sorting `type`  (`asc` or `desc`)

## License
This project is licensed under the [MIT License](./LICENSE)
