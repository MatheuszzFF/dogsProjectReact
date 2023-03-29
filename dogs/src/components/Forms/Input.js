import React from "react";
import styles from "./Input.module.css";
const Input = ({ label, type, name, value, onChange }) => {
  return (
    <fieldset className={styles.wrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={styles.input}
        type={type}
        onChange={onChange}
        value={value}
      />
      <p className={styles.error}>Error</p>
    </fieldset>
  );
};

export default Input;
