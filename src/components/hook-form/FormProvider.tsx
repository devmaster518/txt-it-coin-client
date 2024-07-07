import { UseFormReturn, FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  form: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

export default function FormProvider({ children, onSubmit, form }: Props) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
