import svgPaths from "./svg-imdq4hef0m";

function Heading() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#420d74] text-[30px] text-center tracking-[0.3955px]">Welcome back</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[224.61px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Sign in to your LeapSpace account</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[61.77px] size-[16px] top-[11.29px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2f8e7e80} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17070980} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[103.77px] not-italic text-[#101828] text-[14px] text-center top-[8.5px] tracking-[-0.1504px]">Email</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[58.66px] size-[16px] top-[11.29px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6081_172)" id="Icon">
          <path d={svgPaths.p26187580} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6081_172">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[103.66px] not-italic text-[#4a5565] text-[14px] text-center top-[8.5px] tracking-[-0.1504px]">Phone</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f3f4f6] h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pt-[4px] px-[4px] relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[382px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px]">Email address</p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[40px] left-0 rounded-[10px] top-[28px] w-[382px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(16,24,40,0.5)] tracking-[-0.1504px]">you@example.com</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p30364400} id="Vector" stroke="var(--stroke-0, #420D74)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 1L5.7 5.8" id="Vector_2" stroke="var(--stroke-0, #420D74)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1a58d90} id="Vector_3" stroke="var(--stroke-0, #420D74)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[16px] left-0 top-[76px] w-[142.922px]" data-name="Button">
      <Icon2 />
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[79.5px] not-italic text-[#420d74] text-[12px] text-center top-px">Use password instead</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="Container">
      <Label />
      <EmailInput />
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#420d74] content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.1504px]">Sign in</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] h-px min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[119.211px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">OR CONTINUE WITH</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[16px] h-[32px] items-center relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Text />
      <Container3 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6081_210)" id="Icon">
          <path d={svgPaths.p174d54c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M17.6417 6.66667H10" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p29c09040} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p14d24500} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p20d10600} id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6081_210">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[47.008px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[24.5px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Google</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white col-[1] css-por8k5 relative rounded-[10px] row-[1] self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Icon3 />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p30c8d680} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[63.961px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[32.5px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Facebook</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white col-[2] css-por8k5 relative rounded-[10px] row-[1] self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Icon4 />
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1bcdee00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 7.5H1.66667V17.5H5V7.5Z" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25677470} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[55.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[28px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">LinkedIn</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white col-[1] content-stretch css-vsca90 flex gap-[8px] items-center justify-center p-px relative rounded-[10px] row-[2] self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon5 />
      <Text3 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6081_158)" id="Icon">
          <path d={svgPaths.p1b5d0980} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p20dfe400} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6081_158">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[38.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[19.5px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Apple</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white col-[2] content-stretch css-vsca90 flex gap-[8px] items-center justify-center p-px relative rounded-[10px] row-[2] self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon6 />
      <Text4 />
    </div>
  );
}

function Container5() {
  return (
    <div className="gap-[12px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(2,_minmax(0,_1fr))] h-[92px] relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[190.9px] not-italic text-[#420d74] text-[14px] text-center top-[8.5px] tracking-[-0.1504px]">+ 97 more login methods</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[24px] left-[240.76px] top-0 w-[55.797px]" data-name="Button">
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[28px] not-italic text-[#420d74] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px]">Sign up</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[163.45px] not-italic text-[#4a5565] text-[14px] text-center top-[3.5px] tracking-[-0.1504px] w-[156px]">{`Don't have an account?`}</p>
      <Button9 />
    </div>
  );
}

function SignIn() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[488px] items-start relative shrink-0 w-full" data-name="SignIn">
      <Container1 />
      <Container2 />
      <Button3 />
      <Container4 />
      <Container5 />
      <Button8 />
      <Paragraph1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white h-[554px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[33px] px-[33px] relative size-full">
        <SignIn />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[219.17px] top-px w-[32.539px]" data-name="Link">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#420d74] text-[12px] text-center">terms</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[258.65px] top-px w-[77.125px]" data-name="Link">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#420d74] text-[12px] text-center">privacy policy</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[367.09px] top-px w-[73.375px]" data-name="Link">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#420d74] text-[12px] text-center">cookie policy</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[111.97px] not-italic text-[#6a7282] text-[12px] text-center top-px w-[216px]">{`By continuing, I agree to Leapspace's`}</p>
      <Link />
      <p className="-translate-x-1/2 absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[255.21px] not-italic text-[#6a7282] text-[12px] text-center top-px w-[7px]">,</p>
      <Link1 />
      <p className="-translate-x-1/2 absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[351.77px] not-italic text-[#6a7282] text-[12px] text-center top-px w-[32px]">, and</p>
      <Link2 />
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[442.46px] not-italic text-[#6a7282] text-[12px] text-center top-px">.</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[698px] items-start left-[439.5px] top-[139px] w-[448px]" data-name="Container">
      <Container />
      <Container6 />
      <Paragraph2 />
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[rgba(255,255,255,0)] border-[#e5e7eb] border-b border-solid h-[74px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-0 w-[1327px]" data-name="Container" />;
}

function Frame1() {
  return (
    <div className="absolute contents inset-[35.88%_80.24%_27.03%_0]">
      <div className="absolute inset-[48.55%_80.24%_27.03%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39.5191 14.648">
          <path d={svgPaths.p34cbc8c0} fill="var(--fill-0, #148D57)" id="Ellipse 64" />
        </svg>
      </div>
      <div className="absolute inset-[39.5%_92.49%_45.02%_2.87%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.28699 9.28699">
          <path d={svgPaths.p128838f2} fill="var(--fill-0, white)" id="Ellipse 62" />
        </svg>
      </div>
      <div className="absolute inset-[39.83%_82.91%_44.69%_12.45%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.28699 9.28699">
          <path d={svgPaths.p128838f2} fill="var(--fill-0, white)" id="Ellipse 63" />
        </svg>
      </div>
      <div className="absolute inset-[35.88%_81.46%_31.79%_1.23%]" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6242 19.3997">
          <path d={svgPaths.pf9a43c0} fill="var(--fill-0, #1AB16C)" id="Union" />
        </svg>
      </div>
      <div className="absolute inset-[42.03%_93.18%_46.98%_3.52%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.59719 6.59719">
          <path d={svgPaths.p2f78a510} fill="var(--fill-0, black)" id="Ellipse 65" />
        </svg>
      </div>
      <div className="absolute inset-[42.03%_83.73%_46.98%_12.97%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.59719 6.59719">
          <path d={svgPaths.p3dcd9900} fill="var(--fill-0, black)" id="Ellipse 66" />
        </svg>
      </div>
      <div className="absolute inset-[44.08%_94.07%_54.06%_4.81%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.23634 1.11817">
          <path d={svgPaths.p33718700} fill="var(--fill-0, white)" id="Ellipse 67" />
        </svg>
      </div>
      <div className="absolute inset-[44.11%_85.02%_54.03%_13.86%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.23634 1.11817">
          <path d={svgPaths.p33718700} fill="var(--fill-0, white)" id="Ellipse 68" />
        </svg>
      </div>
      <div className="absolute inset-[58.24%_88.9%_37.66%_8.78%]">
        <div className="absolute inset-[-11.12%_-6.03%_-23.19%_-6.24%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.20984 3.30396">
            <path d={svgPaths.p3666b00} id="Vector 23" stroke="var(--stroke-0, black)" strokeWidth="0.78272" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Vector() {
  return (
    <div className="absolute contents inset-[26.93%_0.01%_27.33%_23.49%]" data-name="Vector">
      <div className="absolute inset-[60.36%_15.59%_34.41%_82.84%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.13806 3.13834">
          <path d={svgPaths.p2fa4c570} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.57%_8.27%_33.87%_84.66%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.135 14.1347">
          <path d={svgPaths.p4368d00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[35.73%_5.76%_34.41%_92.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.76738 17.9156">
          <path d={svgPaths.p80adb00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[26.93%_2.35%_66.58%_96.08%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.13463 3.89331">
          <path d={svgPaths.p2e372300} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[26.93%_0.01%_66.58%_97.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.25762 3.89331">
          <path d={svgPaths.p1cc63300} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[36.12%_71.87%_34.39%_23.49%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.28386 17.6998">
          <path d={svgPaths.p2c19a700} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_65.08%_33.85%_28%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.8397 14.0859">
          <path d={svgPaths.p35524500} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_57.73%_33.85%_35.22%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0857 14.0859">
          <path d={svgPaths.p3ce8e080} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_49.56%_27.33%_43.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.061 18.0014">
          <path d={svgPaths.p33787600} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_37.32%_27.33%_55.65%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0617 18.0014">
          <path d={svgPaths.p2a75e700} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_29.98%_33.85%_62.98%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0856 14.0859">
          <path d={svgPaths.p15b90500} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_25.06%_33.85%_70.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.21 14.0859">
          <path d={svgPaths.p118b5080} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.67%_17.93%_33.85%_75.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.8397 14.0859">
          <path d={svgPaths.p2c986400} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[37.39%_45.01%_33.41%_50.47%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.02569 17.519">
          <path d={svgPaths.p322fe100} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute contents inset-[26.93%_0.01%_27.03%_0]">
      <Frame1 />
      <Vector />
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[60px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Frame2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-full" data-name="Frame">
      <Icon7 />
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[60px] relative shrink-0 w-[200px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Frame />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[27px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Support</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function SupportDropdown() {
  return (
    <div className="flex-[1_0_0] h-[34px] min-h-px min-w-px relative rounded-[8px]" data-name="SupportDropdown">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[11px] py-px relative size-full">
          <Text5 />
          <Icon8 />
        </div>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[16px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[8px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px]">🇺🇸</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[9.5px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">EN</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function LanguageSelector() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-[82.68px]" data-name="LanguageSelector">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[11px] py-px relative size-full">
        <Text6 />
        <Text7 />
        <Icon9 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[38px] relative shrink-0 w-[189.992px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <SupportDropdown />
        <LanguageSelector />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex h-[73px] items-center justify-between left-0 px-[24px] top-0 w-[1327px]" data-name="Container">
      <Button10 />
      <Container9 />
    </div>
  );
}

function AuthHeader() {
  return (
    <div className="absolute bg-white h-[74px] left-0 top-0 w-[1327px]" data-name="AuthHeader">
      <Container8 />
      <Container10 />
    </div>
  );
}

function AuthLayout() {
  return (
    <div className="bg-[#f9fafb] h-[902px] relative shrink-0 w-full" data-name="AuthLayout">
      <Container7 />
      <AuthHeader />
    </div>
  );
}

export default function LeapspaceWeb() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="leapspace web">
      <AuthLayout />
    </div>
  );
}