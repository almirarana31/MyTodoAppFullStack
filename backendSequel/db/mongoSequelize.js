import mongoose from 'mongoose';
import MongoModel from './mongoModel.js';

class MongoSequelize {
  constructor(uri, options = {}) {
    this.uri = uri;
    this.options = options;
  }

  async authenticate() {
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...this.options,
    });
    console.log("MongoDB connected");
  }

  define(modelName, schemaDefinition, options = {}) {
    return new MongoModel(modelName, schemaDefinition, options);
  }
}

export default MongoSequelize;