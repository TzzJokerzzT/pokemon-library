"use client";

import { Button, Form, Input } from "@heroui/react";
import { ChangeEventHandler, FormEvent, useState } from "react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { FormData } from "./utils/constants";

export const FormLogin = ({
  isLoading,
  onSubmitAction,
  emailValue,
  emailValueAction,
  passwordValue,
  passwordValueAction,
}: {
  isLoading: boolean;
  onSubmitAction: (event: FormEvent<HTMLFormElement>) => void;
  emailValue: string;
  emailValueAction: ChangeEventHandler<HTMLInputElement>;
  passwordValue: string;
  passwordValueAction: ChangeEventHandler<HTMLInputElement>;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((v) => !v);
  return (
    <Form onSubmit={onSubmitAction}>
      <Input
        isRequired
        isClearable
        errorMessage={FormData.input.email.errorMessage}
        label={FormData.input.email.label}
        name={FormData.input.email.name}
        placeholder={FormData.input.email.placeholder}
        type={FormData.input.email.type}
        value={emailValue}
        onChange={emailValueAction}
        className="mb-4"
      />
      <Input
        isRequired
        isClearable
        errorMessage={FormData.input.password.errorMessage}
        label={FormData.input.password.label}
        name={FormData.input.password.name}
        placeholder={FormData.input.password.placeholder}
        type={isVisible ? "email" : "password"}
        value={passwordValue}
        onChange={passwordValueAction}
        className="mb-4"
        endContent={
          <button
            aria-label={FormData.input.password.aria_label}
            className="focus:outline-solid outline-transparent"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
      />
      <Button
        isLoading={isLoading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pokemon-button-from to-pokemon-button-to text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        type="submit"
      >
        Login
      </Button>
    </Form>
  );
};
