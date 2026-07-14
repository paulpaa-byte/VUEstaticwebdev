const { requireRole } = require("../shared/auth");
const { getCourses, saveCourses } = require("../shared/blobStore");

module.exports = async function (context, req) {
  try {
    requireRole(req, "administrator");
    const courseId = context.bindingData.id;
    const courses = await getCourses();
    const filtered = courses.filter(course => course.id !== courseId);
    await saveCourses(filtered);
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { courses: filtered }
    };
  } catch (error) {
    context.res = {
      status: error.statusCode || 500,
      body: { error: error.message }
    };
  }
};