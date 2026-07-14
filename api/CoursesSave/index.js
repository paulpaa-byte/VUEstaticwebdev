const { requireRole } = require("../shared/auth");

module.exports = async function (context, req) {
  try {
    const { getCourses, saveCourses } = require("../shared/blobStore");
    requireRole(req, "administrator");
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const course = payload && payload.course ? payload.course : null;
    if (!course || !course.id) {
      context.res = { status: 400, body: { error: "Course payload is required." } };
      return;
    }

    const courses = await getCourses();
    const existingIndex = courses.findIndex(item => item.id === course.id);
    if (existingIndex >= 0) {
      courses.splice(existingIndex, 1, course);
    } else {
      courses.unshift(course);
    }

    await saveCourses(courses);
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { courses }
    };
  } catch (error) {
    context.res = {
      status: error.statusCode || 500,
      body: { error: error.message }
    };
  }
};