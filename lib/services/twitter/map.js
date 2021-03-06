exports.contact = {
    photo: 'profile_image_url',
    address: {
        type:'location',
        key:'location'
    },
    nickname: 'screen_name',
    at: function(data) { return new Date(data.created_at).getTime() }
};

exports.tweet = {
    id: 'id_str',
    fromName: '',
    fromId: '',
    at: function(data) { return new Date(data.created_at).getTime() }
};

exports.related = {
    id: '_id'
};

exports.defaults = {
  friends: 'contact',
  timeline: 'tweet',
  mentions: 'tweet',
  tweets: 'tweet',
  self: 'contact'
}
