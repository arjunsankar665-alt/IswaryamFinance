import mongoose from 'mongoose';

let isConnecting = false;

const getUri = () => {
	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error('Missing MONGODB_URI environment variable.');
	}
	return uri;
};

export const connectDB = async () => {
	if (isConnecting || mongoose.connection.readyState === 1) {
		return mongoose.connection;
	}

	try {
		isConnecting = true;
		mongoose.set('strictQuery', true);

		const uri = getUri();
		const dbName = process.env.MONGODB_DB || 'sri_iswaryam';

		await mongoose.connect(uri, {
			dbName,
			maxPoolSize: 10,
			autoIndex: true
		});

		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB disconnected. Attempting reconnection...');
		});

		console.log(`✅ MongoDB connected (db: ${dbName})`);
		return mongoose.connection;
	} catch (error) {
		console.error('❌ MongoDB connection error:', error.message);
		throw error;
	} finally {
		isConnecting = false;
	}
};

export const disconnectDB = async () => {
	if (mongoose.connection.readyState === 0) {
		return;
	}
	await mongoose.disconnect();
};

