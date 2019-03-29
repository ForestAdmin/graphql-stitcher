# GraphQL Stitcher

<p align="center">
  <img src="https://github.com/ForestAdmin/graphql-stitcher/blob/master/assets/logo.png?raw=true" alt="GraphQL Stitcher Logo">
</p>

* [About the Project](#about-the-project)
* [Quickstart](#quickstart)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## About the project
This project is a **human-friendly** library used to implement the concept GraphQL Schema Stitching. The goal is to stitch together multiple GraphQL schema in a flash.

A use case could be the need to abstract multiple heterogeneous datasources through a single GraphQL endpoint. This is commonly encountered in large microservices architecture.

## Quickstart

### Prerequisites

- NodeJS
- NPM

### Installation

```sh
npm install graphql-stitcher
```

### Usage

```javascript
const schemaManager = new GraphQLStitcher();

// "countries" public API
const countrySchema = await schemaManager.createRemoteSchema('https://countries.trevorblades.com');

// Github API
const githubSchema = await schemaManager.createRemoteSchema('https://api.github.com/graphql', {
  headers: { authorization: `Bearer ${process.env.STRIPE_TOKEN}`, },
});

// Local GraphQL schema
const dbSchema = schemaManager.createLocalSchema(__dirname + '/graphql');

// Stitch!
const schema = schemaManager.stitch();

// … … …

// Example with ApolloServer
const server = new ApolloServer({ schema });
```

A complete example can be found in the [example/](https://github.com/ForestAdmin/graphql-stitcher/tree/master/example) directory.


### Adding a remote schema

```javascript
.createRemoteSchema(string uri, object opts) -> Promise
```

- uri: the remote location of the GraphQL remote schema. Example: `'https://api.github.com/graphql'`
- opts: (optional) a Javascript Object to pass more options to the HTTP request that will fetch the GraphQL schema. Most of the time, it is used to pass authentication details. Example:

	```javascript
	{ headers: { authorization: `Bearer ${process.env.STRIPE_TOKEN}` }}
	```


### Adding a local schema

```javascript
.createLocalSchema(string directory) -> Object
```

The `createLocalSchema` function automatically import all files specified under the parameter passed as an argument `directory`. Each file should respect the following syntax:

```javascript
module.exports = function () {
  this.getSchema = function () {
  };

  this.getResolver = function () {
  };
}
```

A complete example can be found in the [example/](https://github.com/ForestAdmin/graphql-stitcher/tree/master/example) directory.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

- Fork the Project
- Create your Feature Branch (git checkout -b feature/AmazingFeature)
- Commit your Changes (git commit -m 'Add some AmazingFeature)
- Push to the Branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## License
[MIT](https://github.com/ForestAdmin/graphql-stitcher/blob/master/LICENSE)

## Contact
This project is currently maintained by [Forest Admin](https://www.forestadmin.com). Don't hesitate to join the Slack community if you have any questions: [http://community.forestadmin.com](http://community.forestadmin.com)
