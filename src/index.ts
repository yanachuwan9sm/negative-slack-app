export default class Test {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  public sayHello(element: HTMLElement | null) {
    if (element) {
      element.innerText = this.message;
    }
  }
}
