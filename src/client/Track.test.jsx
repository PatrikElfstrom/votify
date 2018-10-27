import 'isomorphic-fetch';
import React from 'react';
import { shallow } from 'enzyme';
import fetchMock from 'fetch-mock';
import Track from './Track';

describe('Track', () => {
  it('should render correctly in "debug" mode', () => {
    const item = {
      added_by: {
        id: 'asdf',
      },
      track: {
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/3CjlHNtplJyTf9npxaPl5w',
            },
            href: 'https://api.spotify.com/v1/artists/3CjlHNtplJyTf9npxaPl5w',
            id: '3CjlHNtplJyTf9npxaPl5w',
            name: 'CHVRCHES',
            type: 'artist',
            uri: 'spotify:artist:3CjlHNtplJyTf9npxaPl5w',
          },
        ],
        id: '31AyUvMRDvZjyQI1N05lsT',
        name: 'The Mother We Share',
        preview_url:
          'https://p.scdn.co/mp3-preview/2976570ddf705ee19275d27cd1fd1d6c9f3b8a08?cid=8e07786e0d864d70a5aa968b79a1c074',
        uri: 'spotify:track:31AyUvMRDvZjyQI1N05lsT',
      },
    };

    fetchMock.mock(`/api/votes?trackId=${item.track.id}`, '[{"vote":-1}]');

    const wrapper = shallow(<Track item={item} />);

    expect(wrapper).toMatchSnapshot();
  });
});
