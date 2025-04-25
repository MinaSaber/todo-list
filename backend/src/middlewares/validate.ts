import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};

      for (const key in result.error.format()) {
        if (key !== "_errors") {
          const errorMessages = (result.error.format() as any)[key]._errors;
          formattedErrors[key] = Array.isArray(errorMessages)
            ? errorMessages.join(", ")
            : "Invalid value";
        }
      }

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
      return;
    }

    next();
  };
};

export default validate;
