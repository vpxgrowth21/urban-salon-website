import { PageIntro } from './ui';
export function Policy({ kind }: { kind: 'privacy' | 'terms' | 'booking' }) {
  const title =
    kind === 'privacy'
      ? 'Your privacy matters.'
      : kind === 'terms'
        ? 'A little clarity.'
        : 'Your appointment, explained.';
  return (
    <>
      <PageIntro
        eyebrow="DEMONSTRATION POLICY"
        title={title}
        description="Draft structure for owner and legal review before launch. These are demo notices, not approved production policies."
      />
      <article className="section policy">
        <div className="notice">
          Frontend demonstration only. No real appointments, payments or notifications. Please enter
          synthetic information.
        </div>
        {kind === 'privacy' ? (
          <>
            <h2>What this demonstration stores</h2>
            <p>
              Sample booking details (name, mobile number, chosen services, requested time and
              optional notes) and enquiries are saved in your browser’s localStorage. No customer
              data is sent to a salon database or notification provider. The same browser’s owner
              demo can access this local data.
            </p>
            <h2>Your choices</h2>
            <p>
              No account, email, payment or marketing consent is needed. Do not enter sensitive
              information. Cancel a demo request from its status page, or use “Reset demo” in the
              owner demo to remove all local requests, enquiries and edits. Clearing site data in
              your browser also removes them. Data stays until reset or browser removal; there is no
              server backup.
            </p>
            <h2>Images and infrastructure</h2>
            <p>
              Stock photographs are served as website assets. Your hosting provider may process
              ordinary technical request logs when this frontend is deployed. No analytics or
              marketing trackers are included.
            </p>
            <h2>Before production</h2>
            <p>
              The owner must approve the data controller’s details, lawful processing purposes,
              retention rules, access restrictions, customer rights and a verified privacy contact.
              A production policy requires review before collecting real customer information.
            </p>
          </>
        ) : kind === 'terms' ? (
          <>
            <h2>Using this demonstration</h2>
            <p>
              This website lets you explore illustrative beauty services and test a simulated
              appointment journey. Prices, photos, operating hours and availability are provisional.
              They are not official salon quotes, real portfolio work or guaranteed appointment
              slots.
            </p>
            <h2>Requests and payment</h2>
            <p>
              No contract for a real appointment is created by submitting a demo request or
              approving it in the public owner demo. No payment is collected. Any future booking
              will require salon approval under the owner’s final policy.
            </p>
            <h2>Content and availability</h2>
            <p>
              Final services, inclusions, rates, address and contact details need owner
              confirmation. Treatment suitability and individual requirements should be discussed
              with the salon.
            </p>
            <h2>Owner review before launch</h2>
            <p>
              Business identity, customer support, service terms, cancellation expectations and
              applicable legal terms must be completed and reviewed before a live launch.
            </p>
          </>
        ) : (
          <>
            <h2>Request first. Salon approval next.</h2>
            <p>
              Choosing a service and time is a preference, not confirmation. A real appointment will
              be confirmed only after salon review. The current frontend simulates this process
              locally without sending your request.
            </p>
            <h2>Demonstration holds</h2>
            <p>
              A valid sample request creates a temporary mock hold, initially five minutes. The
              owner demo can change the illustrative hold duration. Expired or declined holds
              release the time. Confirmed demo appointments remain allocated until cancelled or
              completed. These holds cannot coordinate different devices and do not guarantee real
              availability.
            </p>
            <h2>Payment at the salon</h2>
            <p>
              No advance online payment is requested. All shown prices are illustrative, unverified
              and subject to the owner’s final rate card. Starting prices may vary by hair length,
              selected options or consultation.
            </p>
            <h2>Changes to your plans</h2>
            <p>
              Please let the salon know if plans change so your time can be offered to someone else.
              In this demo, use your browser-local status link to cancel or respond to a proposed
              time. A proposed time is not held; availability is checked again when accepted.
            </p>
            <h2>Policies awaiting confirmation</h2>
            <p>
              The owner still needs to approve operating hours, hold duration, response
              expectations, cancellation and rescheduling rules, resources and any future reminder
              channels.
            </p>
          </>
        )}
      </article>
    </>
  );
}
