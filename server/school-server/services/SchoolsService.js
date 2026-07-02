const { v4: uuidv4 } = require('uuid');
const Service = require('./Service');

class SchoolsService extends Service {
  constructor() {
    super();
    // Seed data
    this.data = [
      {
        id: 'school-1',
        name: 'Tribhuvan Secondary School',
        address: 'Kathmandu, Bagmati Province',
        phone: '01-4100001',
        email: 'info@tribhuvanschool.edu.np',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'school-2',
        name: 'Everest Academy',
        address: 'Lalitpur, Bagmati Province',
        phone: '01-5200002',
        email: 'contact@everestacademy.edu.np',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getAllSchools() {
    return this.data;
  }

  async getSchoolById(id) {
    return this.findById(id);
  }

  async createSchool(body) {
    const school = {
      id: uuidv4(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    return this.create(school);
  }

  async updateSchool(id, body) {
    return this.update(id, body);
  }

  async deleteSchool(id) {
    return this.delete(id);
  }
}

module.exports = SchoolsService;
