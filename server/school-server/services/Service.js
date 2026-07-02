class Service {
  constructor() {
    this.data = [];
  }

  findAll() {
    return this.data;
  }

  findById(id) {
    return this.data.find(item => item.id === id) || null;
  }

  create(item) {
    this.data.push(item);
    return item;
  }

  update(id, updates) {
    const idx = this.data.findIndex(item => item.id === id);
    if (idx === -1) return null;
    this.data[idx] = { ...this.data[idx], ...updates };
    return this.data[idx];
  }

  delete(id) {
    const idx = this.data.findIndex(item => item.id === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }
}

module.exports = Service;
