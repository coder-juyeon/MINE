import React, { useEffect } from "react";
import MainProductListComponent from "../../components/Main/MainProductListComponent"
import { productListAtom } from "../../../recoil/atoms/productListAtom";
import { useRecoilValue } from 'recoil';

const MainContentContainer = () => {
  const productList = useRecoilValue(productListAtom);

  if(!productList || productList.length === 0){
    return;
  }


  return (
    <>
      <div
        className="mx-auto px-4 md:px-8 2xl:px-16 box-content max-w-[1024px] min-[1600px]:max-w-[1280px]"
        style={{ height: "auto" }}
      >
         <MainProductListComponent product={productList[0]}/>
         <MainProductListComponent product={productList[1]}/>
         <MainProductListComponent product={productList[2]}/>

        <section className="relative aspect-[375/590] min-[761px]:aspect-[2560/680] bg-no-repeat bg-cover bg-center bg-app-down-main-mobile min-[761px]:bg-app-down-main-pc mb-12 md:mb-14 xl:mb-16 max-w-[1024px] min-[1600px]:max-w-[1280px] -mx-4 md:mx-auto">
          <div className="justify-start flex absolute space-x-2 w-[81.5%] aspect-[311/48] top-[27.63%] left-[8.5%] min-[761px]:w-[31.5%] min-[761px]:aspect-[392/52] min-[761px]:top-[58%] min-[761px]:left-[15.625%]">
            <a
              className="w-[49%] min-[761px]:w-[41%] relative"
              href="https://tracking.joongna.com/lowerbanner_aos"
            >
              <img
                alt="구글 플레이스토어"
                src="https://common.joongna.com/image/appdownload/btn_google_web_240219.webp"
                decoding="async"
                data-nimg="fill"
                className="max-[760px]:hidden"
                loading="lazy"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  color: "transparent",
                }}
              />
              <img
                alt="구글 플레이스토어"
                src="https://common.joongna.com/image/appdownload/btn_google_mobile_240219.webp"
                decoding="async"
                data-nimg="fill"
                className="min-[761px]:hidden"
                loading="lazy"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  color: "transparent",
                }}
              />
            </a>
            <a
              className="w-[49%] min-[761px]:w-[39%] relative"
              href="https://tracking.joongna.com/lowerbanner_ios"
            >
              <img
                alt="앱 스토어"
                src="https://common.joongna.com/image/appdownload/btn_apple_web_240219.webp"
                decoding="async"
                data-nimg="fill"
                className="max-[760px]:hidden"
                loading="lazy"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  color: "transparent",
                }}
              />
              <img
                alt="앱 스토어"
                src="https://common.joongna.com/image/appdownload/btn_apple_mobile_240219.webp"
                decoding="async"
                data-nimg="fill"
                className="min-[761px]:hidden"
                loading="lazy"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  color: "transparent",
                }}
              />
            </a>
            <img
              alt="QR code"
              src="https://common.joongna.com/image/appdownload/app_qr_code_240219.webp"
              width="66"
              height="66"
              decoding="async"
              data-nimg="1"
              className="max-[760px]:hidden basis-[12%]"
              loading="lazy"
              style={{ color: "transparent" }}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default MainContentContainer;