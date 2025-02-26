import React from "react";

const Form = ({ children, onFinish, layout = "vertical" }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    onFinish(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
    </form>
  );
};

Form.useForm = () => {
  const form = {
    getFieldValue: (field) => {
      // Form elemanlarından değer alma
      const element = document.querySelector(`[name="${field}"]`);
      return element ? element.value : undefined;
    },
    setFieldsValue: (values) => {
      // Form elemanlarına değer atama
      Object.entries(values).forEach(([field, value]) => {
        const element = document.querySelector(`[name="${field}"]`);
        if (element) element.value = value;
      });
    },
    resetFields: () => {
      // Formu sıfırlama
      const form = document.querySelector('form');
      if (form) form.reset();
    }
  };

  return [form];
};

export default Form;