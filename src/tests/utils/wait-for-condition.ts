
async function waitForCondition(checkFn: () => Promise<boolean>, interval: number = 1000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      const checkCondition = async () => {
        try {
          while (!(await checkFn())) {
              await new Promise(res => setTimeout(res, interval));
          }
          resolve();
        } catch (error) {
          reject(error)
        }
      };
      checkCondition();
  });
}

export default waitForCondition;
