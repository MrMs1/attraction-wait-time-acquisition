export class Attraction {
  name: string;
  textContent: {
    operationStatus: string | null;
    waitTime: string | null;
  };

  constructor(
    name: string,
    operationStatus: string | null,
    waitTime: string | null
  ) {
    operationStatus = operationStatus
      ? operationStatus.replace(/状況＝|[\r\n\s]+/g, "")
      : null;
    this.name = name;
    this.textContent = { operationStatus, waitTime };
  }

  waitTime(): WaitTime {
    // 運休の場合は-を返す
    if (this.textContent.operationStatus !== "営業中/OPEN") {
      return "-";
    }
    if (this.textContent.waitTime === null) {
      throw new Error(`${this.name}の待ち時間が取得できませんでした。`);
    }
    const waitTimeMatch = this.textContent.waitTime
      .replace(/\s+/g, "")
      .match(/:?(\d+)分/);
    if (waitTimeMatch && waitTimeMatch[1]) {
      return parseInt(waitTimeMatch[1]);
    } else {
      return 0;
    }
  }
}

export type WaitTime = number | "-";
