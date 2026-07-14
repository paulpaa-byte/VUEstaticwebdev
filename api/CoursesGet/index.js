module.exports = async function (context) {
  try {
    const { getCourses } = require("../shared/blobStore");
    const courses = await getCourses();
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: { courses }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        error: error.message || "Courses API failed.",
        source: "CoursesGet"
      }
    };
  }
};