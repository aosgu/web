import Chrome, { Marquee } from "./components/Chrome";
import Section from "./components/Section";
import Hero from "./components/Hero";
import RangeBands from "./components/RangeBands";
import ResponderVenn from "./components/ResponderVenn";
import SlopeChart from "./components/SlopeChart";
import RadialGains from "./components/RadialGains";
import PeopleGrid from "./components/PeopleGrid";
import Colophon from "./components/Colophon";

export default function App() {
  return (
    <main className="relative">
      <Chrome />

      <Hero />

      <Marquee
        items={[
          "29.3% low responders for muscle size",
          "12% high responders for strength",
          "14.6% no gain or a loss in size",
          "9 people low on both",
          "−11% to +30% muscle size",
          "−8% to +60% leg strength",
        ]}
      />

      <Section
        id="spread"
        no="01"
        kicker="Muscle size & strength"
        title={
          <>
            Every trainee <em>moved</em> differently.
          </>
        }
        lede="Average quadriceps size rose 4.8% and leg-press strength 21.1%. The averages hide how far individuals spread on either side of them."
      >
        <RangeBands />
      </Section>

      <Section
        id="responders"
        no="02"
        kicker="Low & high responders"
        title={
          <>
            Who barely <em>moved?</em>
          </>
        }
        lede="Low responders were defined against non-training controls: anyone whose gain fell below the controls' upper 95% limit. Most low responders for one trait responded on the other."
      >
        <ResponderVenn />
      </Section>

      <Section
        id="sex-age"
        no="03"
        kicker="Sex & age bands"
        title={
          <>
            Men, women, and <em>three</em> age bands.
          </>
        }
        lede="Pre- and post-training leg-press 1RM for each group, in kilograms. Solid lines are training groups; dashed lines are non-training controls. Hover to preview, click to pin."
      >
        <SlopeChart />
      </Section>

      <Section
        id="gains"
        no="04"
        kicker="Relative gains"
        title={
          <>
            Gains, <em>ringed</em>.
          </>
        }
        lede="Mean individual change in 1RM by sex and age band. Each ring is one group; the halo shows ±1 standard deviation."
      >
        <RadialGains />
      </Section>

      <Section
        id="people"
        no="05"
        kicker="The sample"
        title={
          <>
            359 people, <em>eight</em> groups.
          </>
        }
        lede="287 trainees from ten retrospective intervention studies (1996–2011), plus 72 non-training controls, split by sex and age band."
      >
        <PeopleGrid />
      </Section>

      <Colophon />
    </main>
  );
}
