const SchoolsService = require('../services/SchoolsService');

const schoolsService = new SchoolsService();

const getSchools = async (req, res) => {
  try {
    const schools = await schoolsService.getAllSchools();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSchool = async (req, res) => {
  try {
    const school = await schoolsService.createSchool(req.body);
    res.status(201).json(school);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const school = await schoolsService.getSchoolById(req.params.id);
    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSchool = async (req, res) => {
  try {
    const school = await schoolsService.updateSchool(req.params.id, req.body);
    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSchool = async (req, res) => {
  try {
    await schoolsService.deleteSchool(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSchools, createSchool, getSchoolById, updateSchool, deleteSchool };
