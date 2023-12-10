export class Selector {
  name: string;
  operationStatus: string;
  waitTime: string;
  constructor(name: string, operationStatus: string, waitTime: string) {
    this.name = name;
    this.operationStatus = operationStatus;
    this.waitTime = waitTime;
  }
}
