def review_changes(pull_requests):


    reviews = []


    for pr in pull_requests:


        review = {}


        if pr["status"] == "READY_FOR_REVIEW":


            review = {


                "title":

                pr["title"],


                "approval_status":

                "WAITING_FOR_HUMAN_APPROVAL",


                "message":

                "Security fix prepared. Developer approval required before applying."

            }



        else:


            review = {


                "title":

                pr["title"],


                "approval_status":

                "NOT_APPROVED",


                "message":

                "Fix blocked because confidence is low."

            }



        reviews.append(
            review
        )



    return reviews