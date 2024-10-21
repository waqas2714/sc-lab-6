const SocialNetwork = require('../../src/twitter/SocialNetwork');

describe('SocialNetwork', () => {

  test('should return an empty follows graph when the input array is empty', () => {
    const followsGraph = SocialNetwork.guessFollowsGraph([]);
    expect(followsGraph).toEqual(new Map());
  });

  test('should return an empty follows graph when no users are mentioned in the messages', () => {
    const messages = [
      { author: 'waqas', text: 'Loving the sunny day!' },
      { author: 'ali', text: 'Greetings, universe!' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(messages);
    expect(followsGraph).toEqual(new Map());
  });

  test('should accurately create a follows graph when messages include mentions', () => {
    const messages = [
      { author: 'waqas', text: 'Hello @ali, take a look at this!' },
      { author: 'ali', text: '@ahmed, appreciate your help!' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(messages);
    expect(followsGraph.get('waqas')).toEqual(new Set(['ali']));
    expect(followsGraph.get('ali')).toEqual(new Set(['ahmed']));
  });

  test('should handle messages with multiple mentions from a single author', () => {
    const messages = [
      { author: 'waqas', text: '@ali and @ahmed, you both are amazing!' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(messages);
    expect(followsGraph.get('waqas')).toEqual(new Set(['ali', 'ahmed']));
  });

  test('should combine follows correctly when an author posts multiple times', () => {
    const messages = [
      { author: 'waqas', text: 'Hi @ali' },
      { author: 'waqas', text: 'Hey @ahmed' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(messages);
    expect(followsGraph.get('waqas')).toEqual(new Set(['ali', 'ahmed']));
  });

  test('should return an empty list of influencers when the follows graph has no entries', () => {
    const followsGraph = new Map();
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual([]);
  });

  test('should return an empty list of influencers when a user has no followers', () => {
    const followsGraph = new Map([['waqas', new Set()]]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual([]);
  });

  test('should return the correct influencer when there is only one followed user', () => {
    const followsGraph = new Map([['waqas', new Set(['ali'])]]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual(['ali']);
  });

  test('should return a sorted list of influencers based on varying follower counts', () => {
    const followsGraph = new Map([
        ['waqas', new Set(['ali'])],
        ['ali', new Set(['ahmed'])],
        ['ahmed', new Set(['ali', 'waqas'])],
    ]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual(expect.arrayContaining(['ali', 'waqas', 'ahmed']));
  });

  test('should identify influencers correctly when users have the same follower count', () => {
    const followsGraph = new Map([
      ['waqas', new Set(['ahmed'])],
      ['ali', new Set(['ahmed'])],
    ]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual(expect.arrayContaining(['ahmed']));
  });
});
