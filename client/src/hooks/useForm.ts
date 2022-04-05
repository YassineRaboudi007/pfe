import {useState} from "react";

const useForm = <T>(initVals: any) => {
  const [values, setValues] = useState<T>(initVals);
  return [
    values,
    (e: any) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
  ];
};

export default useForm;
