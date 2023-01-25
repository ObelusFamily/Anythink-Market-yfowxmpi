import ItemMeta from "./ItemMeta";
import CommentContainer from "./CommentContainer";
import React from "react";
import { connect } from "react-redux";
import marked from "marked";
import {
  ITEM_PAGE_LOADED,
  ITEM_PAGE_UNLOADED,
} from "../../constants/actionTypes";
import { getItemAndComments } from "./utils/ItemFetcher";

const mapStateToProps = (state) => ({
  ...state.item,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload) => dispatch({ type: ITEM_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ITEM_PAGE_UNLOADED }),
});

class Item extends React.Component {
  async componentDidMount() {
    const [item, comments] = await getItemAndComments(
      this.props.match.params.id
    );
    this.props.onLoad([item, comments]);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.item) {
      return null;
    }

    const markup = {
      __html: marked(this.props.item.description, { sanitize: true }),
    };
    const canModify =
      this.props.currentUser &&
      this.props.currentUser.username === this.props.item.seller.username;

        // check if item.image is null
    const itemImage = this.props.item.image ? (
      this.probs.item.image
    ) : (
      "placeholder.png"
    );

    return (
      <div className="container page" id="item-container">
        <div className="text-dark">
          <div className="row bg-white p-4">
            <div className="col-6">
              <img
                src={this.props.item.image}
                src={itemImage}
                alt={this.props.item.title}
                className="item-img"
                style={{ height: "500px", width: "100%", borderRadius: "6px" }}
              />
            </div>

            <div className="col-6">
              <h1 id="card-title">{this.props.item.title}</h1>
              <ItemMeta item={this.props.item} canModify={canModify} />
              <div dangerouslySetInnerHTML={markup}></div>
              {this.props.item.tagList.map((tag) => {
                return (
                  <span className="badge badge-secondary p-2 mx-1" key={tag}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
