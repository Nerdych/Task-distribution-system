// Core
import express from 'express';
import cors from 'cors';
import { Application } from 'express';
import { ApolloServer, ExpressContext } from 'apollo-server-express';

// Config
import { corsOptions, dbConfig, PORT } from './init/config';

// Schema
import { schema } from './init/schema';

// Resolvers
import { resolvers } from './init/resolvers';

// Database
import { db } from './init/database';

const start = async () => {
	try {
		const app: Application = express();
		const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({ typeDefs: schema, resolvers });

		await db
			.authenticate()
			.then(() => {
				console.log('Connection has been established successfully.');
			})
			.catch(err => {
				console.error('Unable to connect to the database:', err);
			});

		await apolloServer.start();
		apolloServer.applyMiddleware({ app });

		app.use(cors(corsOptions));
		// parse requests of content-type - application/json
		app.use(express.json());
		// parse requests of content-type - application/x-www-form-urlencoded
		app.use(express.urlencoded({ extended: true }));

		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (e) {
		console.error(e);
	}
};

start();
