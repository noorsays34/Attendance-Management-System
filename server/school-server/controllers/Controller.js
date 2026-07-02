class Controller {
  constructor(service) {
    this.service = service;
  }

  sendResponse(res, status, data) {
    return res.status(status).json(data);
  }

  sendError(res, status, message) {
    return res.status(status).json({ error: message });
  }
}

module.exports = Controller;
