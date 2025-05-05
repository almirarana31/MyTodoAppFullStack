import mongoose from 'mongoose';

class MongoModel {
  constructor(name, schemaDefinition, options = {}) {
    const schema = new mongoose.Schema(schemaDefinition, options);
    this.model = mongoose.model(name, schema);
  }

  async create(data) {
    const instance = new this.model(data);
    return instance.save();
  }

  async findAll(filter = {}) {
    return this.model.find(filter);
  }

  async findOne(filter = {}) {
    return this.model.findOne(filter);
  }

  async update(filter, data) {
    return this.model.updateMany(filter, data);
  }

  async delete(filter) {
    return this.model.deleteMany(filter);
  }
}

export default MongoModel;