export interface HelloRequest {
  input: string;
}

export default {
  hello(root: any, {input}: HelloRequest): string {
    return `Hello ${input}`;
  },
};
