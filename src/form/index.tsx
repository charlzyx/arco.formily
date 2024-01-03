import { Form as FormType, IFormFeedback, ObjectField } from "@formily/core";
import { FormProvider, JSXComponent, useParentForm } from "@formily/react";
import React, { useContext } from "react";
import { FormLayout, IFormilyLayoutProps } from "../form-layout";
import { PreviewText } from "../preview-text";
import { ConfigProvider } from "@arco-design/web-react";
import { dayjs } from "@arco-design/web-react/es/_util/dayjs";

export interface FormProps extends IFormilyLayoutProps {
  form?: FormType;
  component?: JSXComponent;
  onAutoSubmit?: (values: any) => any;
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void;
  previewTextPlaceholder?: React.ReactNode;
}

export const Form: React.FC<React.PropsWithChildren<FormProps>> = ({
  form,
  component,
  onAutoSubmit,
  onAutoSubmitFailed,
  previewTextPlaceholder,

  ...props
}) => {
  const top = useParentForm();
  const renderContent = (form: FormType | ObjectField) => {
    return (
      <PreviewText.Placeholder value={previewTextPlaceholder}>
        <FormLayout {...props}>
          {React.createElement(
            component!,
            {
              onSubmit(e: React.FormEvent) {
                e?.stopPropagation?.();
                e?.preventDefault?.();
                form.submit(onAutoSubmit).catch(onAutoSubmitFailed);
              },
            },
            props.children
          )}
        </FormLayout>
      </PreviewText.Placeholder>
    );
  };
  if (form)
    return <FormProvider form={form}>{renderContent(form)}</FormProvider>;
  if (!top) throw new Error("must pass form instance by createForm");
  return renderContent(top);
};

Form.defaultProps = {
  component: "form",
};

export default Form;
