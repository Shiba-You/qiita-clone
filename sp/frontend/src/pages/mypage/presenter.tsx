import { Button } from "../../components/ui/button";
import { instantiate } from "@assemblyscript/loader";
// import init, { hello } from "../../wasm/build/debug.wasm";

const MypagePresenter = () => {
  // useEffect(() => {
  //   init().then()(
  //     () => {
  //       console.log("wasmの読み込み成功");
  //     },
  //     (err: unknown) => {
  //       console.error("wasmの読み込み失敗");
  //       console.error(err);
  //     }
  //   );
  // }, []);
  // const memory = new WebAssembly.Memory({ initial: 100 });
  // const getString = (memory: WebAssembly.Memory, ptr: number) => {
  //   const U8 = new Uint8Array(memory.buffer);
  //   console.log(U8);
  //   let str = "";
  //   while (U8[ptr] !== 0) {
  //     str += String.fromCharCode(U8[ptr++]);
  //   }
  //   console.log(U8[ptr]);
  //   return str;
  // };
  // const writeStringToMemory = (
  //   str: string,
  //   memory: WebAssembly.Memory
  // ): number => {
  //   const encoder = new TextEncoder();
  //   const bytes = encoder.encode(str + "\0"); // null終端文字列にする
  //   const buffer = new Uint8Array(memory.buffer);
  //   const ptr = 1024; // 空いている適当なアドレス（競合しないよう注意）

  //   buffer.set(bytes, ptr);
  //   return ptr;
  // };
  const pushWasm = async () => {
    const response = await fetch("/wasm/build/debug.wasm");
    const bytes = await response.arrayBuffer();
    // const module = await WebAssembly.compile(bytes);

    const { instance } = await instantiate(bytes, {
      env: {
        abort() {
          console.error("Abort");
        },
      },
    });
    const a = instance.exports;
    console.log(a);
    // const { add, hello, __newString, __getString } = instance.exports as {
    //   add: (a: number, b: number) => number;
    //   hello: (x: number) => number;
    //   __newString: (str: string) => number;
    //   __getString: (ptr: number) => string;
    // };
    // console.log("hoge");
    // const strPtr = __newString("hoge");
    // const hp = hello(strPtr);
    // console.log(__getString(hp));
    // console.log(add(10, 20));
  };
  const pushVite = async () => {
    const response = await fetch("/vite");
    console.log(response);
  };

  const myinfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/auth/`,
        {
          method: "GET",
        }
      );
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button onClick={() => myinfo()}>Mypage</Button>
      <div>MypagePresenter</div>
      <button onClick={() => pushWasm()}>wasm</button>
      <button onClick={() => pushVite()}>vite</button>
    </>
  );
};

export default MypagePresenter;
