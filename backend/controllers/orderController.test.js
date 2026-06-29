import test from "node:test";
import assert from "node:assert/strict";

import Course from "../models/courseModel.js";
import { createOrder } from "./orderController.js";

test("createOrder returns 400 when the course price is missing", async () => {
  const originalFindById = Course.findById;

  Course.findById = async () => ({
    _id: "course-1",
    price: undefined,
  });

  const req = {
    body: {
      courseId: "course-1",
    },
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  try {
    await createOrder(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      message: "Course price is invalid",
    });
  } finally {
    Course.findById = originalFindById;
  }
});
