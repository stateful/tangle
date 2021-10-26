import Vrx = require("./vrx");

describe("Vrx.Bus", () => {
  it("should instiantiate a bus instance", () => {
    const bus = new Vrx.Bus<object>("testing", {}, []);
    expect(bus).toBeInstanceOf(Vrx.Bus);
  });
});
