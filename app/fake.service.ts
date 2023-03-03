export async function getCarGenerallyDetails(): Promise<{}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, 1_000);
  });
}

export async function getProcess(): Promise<{}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, 3_000);
  });
}
