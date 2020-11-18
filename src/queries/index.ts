export interface HelloRequest {
  name: string;
}

export default {
  hello(root: any, {name}: HelloRequest): string {
    return `Hello${name ? ` ${name}` : ''}!`;
  },
};
