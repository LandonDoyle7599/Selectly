import { TextFieldProps } from "@mui/material";
import { FormikValues, useFormik } from "formik";


// ================================
// Rounding
// ================================

export function roundToTwoDecimals(number: number): number {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }
  
  // ================================
  // Form Validation
  // ================================
  
  export function formikTextFieldProps<T extends FormikValues>(
    formik: ReturnType<typeof useFormik<T>>,
    field: keyof T,
    label: string
  ): TextFieldProps {
    return {
      label,
      name: field.toString(),
      value: formik.values[field],
      onChange: formik.handleChange,
      error: formik.touched[field] && !!formik.errors[field],
    };
  }
  
  export function formikTextFieldNumberProps<T extends FormikValues>(
    formik: ReturnType<typeof useFormik<T>>,
    field: keyof T,
    label: string
  ): TextFieldProps {
    return {
      label,
      type: "number",
      name: field.toString(),
      value: formik.values[field],
      onChange: formik.handleChange,
      error: formik.touched[field] && !!formik.errors[field],
    };
  }

//Function to remove leading underscores from array of strings and convert to int array
export function removeLeadingUnderscoresAndConvertToIntArray(
  array: string[]
): number[] {
  return array.map((item) => parseInt(item.replace(/^_/, "")));
}
