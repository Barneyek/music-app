import SongItem from "@/components/SongItem.vue";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

describe("SongItem.vue - check component correctly rendering data from props", () => {
  test("render song.display_name", () => {
    const song = {
      display_name: 'test',
    };

    const wrapper = shallowMount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        },
      },
    });
    const compositionAuthor = wrapper.find('.text-gray-500');
    // expect(wrapper.text()).toContain(song.display_name);
    expect(compositionAuthor.text()).toBe(song.display_name);
  });

  test("renders song.docID in id attribiute", () => {
    const song = {
      docID: 'abc',
    };

    const wrapper = shallowMount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        },
      },
    });

    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)
  });
});
