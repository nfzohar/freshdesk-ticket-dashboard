<template>
  <div
    class="bg-secondary-500 shadow-primary-500 border-primary-500 border m-auto h-max w-max rounded-full p-1"
  >
    <img
      v-if="customLoginImage"
      :width="ptWidth"
      :height="ptHeight"
      :src="customLoginImage"
      class="m-auto rounded-full md:w-96 md:h-auto"
    />
    <svg
      v-else
      class="fill-primary-500"
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      :width="`${ptWidth}pt`"
      :height="`${ptHeight}pt`"
      viewBox="0 0 1097.000000 1097.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <metadata>FTD, Created at 11-11-2023</metadata>
      <g transform="translate(0.000000,1097.000000) scale(0.100000,-0.100000)" stroke="none">
        <path
          d="M5190 10727 c-3 -3 -54 -8 -115 -11 -210 -14 -524 -62 -778 -121
          -586 -135 -1169 -384 -1672 -712 -71 -47 -131 -89 -133 -94 -2 -5 -8 -9 -13
          -9 -8 0 -93 -58 -134 -92 -5 -5 -35 -28 -65 -51 -31 -23 -62 -47 -70 -54 -213
          -176 -203 -167 -430 -393 -208 -209 -222 -224 -318 -340 -35 -41 -69 -82 -76
          -90 -7 -8 -43 -55 -80 -105 -37 -49 -71 -95 -76 -102 -6 -7 -48 -68 -94 -135
          -139 -206 -261 -416 -357 -618 -27 -58 -56 -116 -63 -130 -8 -14 -30 -65 -51
          -115 -21 -49 -45 -108 -55 -130 -26 -62 -106 -289 -140 -399 -102 -335 -170
          -676 -212 -1061 -14 -135 -18 -737 -5 -904 41 -536 177 -1098 392 -1616 41
          -99 206 -438 255 -525 107 -186 185 -312 282 -450 515 -732 1184 -1307 1983
          -1700 559 -275 1148 -446 1775 -516 198 -22 713 -30 922 -15 1626 119 3096
          972 3993 2316 513 769 805 1621 876 2555 15 200 6 724 -15 920 -55 492 -176
          976 -358 1430 -76 189 -254 545 -365 728 -168 279 -319 485 -547 751 -131 153
          -369 389 -526 521 -35 30 -73 63 -85 73 -46 42 -228 180 -335 255 -259 181
          -576 361 -861 487 -46 20 -97 43 -114 50 -211 94 -608 220 -895 284 -380 84
          -634 112 -1080 118 -196 2 -358 2 -360 0z m-3173 -1948 c15 -6 145 -127 289
          -270 l260 -259 3502 0 3502 0 -2 -182 -3 -183 -3505 -3 -3505 -2 -260 -259
          c-226 -225 -266 -261 -303 -271 -52 -13 -93 -6 -147 25 -60 35 -591 573 -610
          618 -17 42 -20 104 -5 144 12 30 576 603 625 634 34 21 116 26 162 8z m1883
          -1909 l0 -250 -645 0 -645 0 0 -390 0 -390 585 0 585 0 -2 -247 -3 -248 -582
          -3 -583 -2 0 -600 0 -600 -300 0 -300 0 0 1490 0 1490 945 0 945 0 0 -250z
          m2518 1 c2 -189 -1 -246 -10 -253 -7 -4 -201 -8 -430 -8 l-418 0 0 -1235 0
          -1235 -300 0 -300 0 0 1235 0 1235 -418 0 c-312 0 -421 3 -430 12 -13 13 -18
          451 -6 482 6 15 114 16 1158 14 l1151 -3 3 -244z m1782 235 c368 -42 634 -156
          850 -363 279 -266 416 -719 380 -1260 -28 -442 -150 -748 -387 -974 -184 -176
          -409 -284 -710 -341 -114 -21 -144 -22 -790 -26 l-673 -3 0 1484 c0 816 3
          1487 7 1490 3 4 274 7 602 7 450 0 627 -4 721 -14z m928 -3313 c40 -18 590
          -556 623 -609 10 -17 22 -52 25 -77 12 -87 -14 -121 -328 -434 -290 -289 -321
          -313 -393 -313 -72 0 -104 25 -365 285 l-255 255 -3458 -7 -3457 -6 0 185 0
          185 1952 6 c1073 4 2629 7 3457 7 l1506 0 250 251 c138 138 266 259 285 269
          44 24 111 25 158 3z"
        />
        <path
          d="M7470 5624 l0 -987 293 6 c312 6 411 17 547 62 219 73 378 238 449
          467 72 238 79 596 15 853 -81 326 -283 511 -623 569 -72 12 -163 16 -388 16
          l-293 0 0 -986z"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogoIcon',

  props: {
    ptWidth: {
      type: [String, Number],
      required: false,
      default: 100
    },
    ptHeight: {
      type: [String, Number],
      required: false,
      default: 100
    }
  },

  computed: {
    customLoginImage(): string {
      return import.meta.env.VITE_LOGIN_ICON_URL
    }
  }
})
</script>
