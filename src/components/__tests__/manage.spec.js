import { shallowMount } from "@vue/test-utils";
import Manage from "@/views/Manage.vue";
import compositionItem from "@/components/CompositionItem.vue";

describe("manage.vue", () => {
  test("renders list of songs", () => {
    const songs = [{}, {}, {}];

    const component = shallowMount(Manage, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: (message) => message,
        },
      },
    });

    const items = component.findAllComponents(compositionItem);
    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i]);
    });
  });

});
