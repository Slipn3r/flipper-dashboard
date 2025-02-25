<template>
  <GenericPageLayout
    title="Mfkey32"
    icon="flipper:nfc"
    description="Retreive MF Classic keys from gathered nonces using the mfkey32 attack"
    :has-info="true"
  >
    <NfcMfkey32 />

    <template #info>
      <h6 class="q-mt-none q-mb-sm">Mfkey32 attack</h6>
      <p>
        The mfkey32 attack is a method to retrieve the keys of MF Classic cards by using the nonces gathered during the
        communication between the card and the reader. The attack is based on the fact that the nonces are generated
        using a weak random number generator, which allows an attacker to recover the keys by analyzing the nonces.
      </p>
      <p>
        Saved nonces are stored in the log file on Flipper's SD card. We are feeding nonces one by one into mfkey32, looking for new keys. Once discovered, new keys will be added to the user dictionary file and will be available for future cracks.
      </p>
      <p>
        You can also run the attack by entering the nonce manually.
      </p>
    </template>
  </GenericPageLayout>
</template>

<script setup lang="ts">
import { GenericPageLayout } from 'shared/components/GenericPageLayout';
import { NfcMfkey32 } from 'widgets/NFC/Mfkey32';
</script>
